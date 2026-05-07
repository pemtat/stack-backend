import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    if (admin.apps.length === 0) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        this.logger.log('Firebase Admin Initialized');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin', error);
      }
    }
  }

  async sendToAllUsers(title: string, body: string, data?: any) {
    // 1. Fetch all devices that have a push token
    const devices = await this.prisma.userDevice.findMany({
      where: {
        pushToken: { not: null },
      },
      select: {
        pushToken: true,
      },
    });

    if (devices.length === 0) {
      this.logger.log('No devices found with push tokens.');
      return;
    }

    // 2. Extract tokens
    const tokens = devices.map((device) => device.pushToken) as string[];

    // 3. Construct message
    const message: admin.messaging.MulticastMessage = {
      notification: { title, body },
      data: data,
      tokens: tokens,
    };

    try {
      // 4. Send multicast message
      const response = await admin.messaging().sendEachForMulticast(message);
      this.logger.log(
        `Successfully sent multicast message: ${response.successCount} successes, ${response.failureCount} failures`,
      );

      // 5. Handle failures (e.g., remove invalid tokens)
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (
            !resp.success &&
            (resp.error?.code ===
              'messaging/registration-token-not-registered' ||
              resp.error?.code === 'messaging/invalid-registration-token')
          ) {
            failedTokens.push(tokens[idx]);
          }
        });

        if (failedTokens.length > 0) {
          await this.prisma.userDevice.deleteMany({
            where: { pushToken: { in: failedTokens } },
          });
          this.logger.log(`Removed ${failedTokens.length} invalid tokens.`);
        }
      }
    } catch (error) {
      this.logger.error('Error sending multicast message:', error);
    }
  }
}
