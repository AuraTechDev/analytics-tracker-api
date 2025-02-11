import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  Injectable,
} from '@nestjs/common';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handle(error: Error, contextMessage: string): never {
    this.logger.error(
      `DynamoDB Error: ${contextMessage} - ${error.message}`,
      error.stack,
    );

    if (error instanceof DynamoDBServiceException) {
      switch (error.name) {
        case 'ConditionalCheckFailedException':
          throw new BadRequestException('Condition check failed.');
        case 'ProvisionedThroughputExceededException':
          throw new InternalServerErrorException(
            'DynamoDB throughput exceeded. Please try again later.',
          );
        case 'ResourceNotFoundException':
          throw new NotFoundException(
            'Requested resource (table or item) was not found.',
          );
        case 'ItemCollectionSizeLimitExceededException':
          throw new BadRequestException('Item size exceeds the allowed limit.');
        case 'TransactionConflictException':
          throw new BadRequestException(
            'Transaction conflict detected. Retry the request.',
          );
        case 'ValidationException':
          throw new BadRequestException('Invalid request data.');
        case 'AccessDeniedException':
          throw new InternalServerErrorException('Access denied to DynamoDB.');
        case 'InternalServerError':
          throw new InternalServerErrorException('Internal error in DynamoDB.');
        default:
          throw new InternalServerErrorException(
            `DynamoDB error: ${error.name}`,
          );
      }
    }

    throw new InternalServerErrorException(
      `An unexpected error occurred: ${error.message}`,
    );
  }
}
