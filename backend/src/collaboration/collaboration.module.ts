import { Module } from '@nestjs/common';
import { CollaborationService } from './services/collaboration.service';

@Module({
  providers: [CollaborationService]
})
export class CollaborationModule {}
