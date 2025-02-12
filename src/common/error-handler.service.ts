import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handle(error: Error, contextMessage: string): never {
    this.logger.error(`${contextMessage} - ${error.message}`, error.stack);

    if (error instanceof DynamoDBServiceException) {
      switch (error.name) {
        case 'ConditionalCheckFailedException':
          this.throwBadRequest('Condition check failed.');
          break;
        case 'ProvisionedThroughputExceededException':
          this.throwInternalError(
            'DynamoDB throughput exceeded. Please try again later.',
          );
          break;
        case 'ResourceNotFoundException':
          this.throwNotFound(
            'Requested resource (table or item) was not found.',
          );
          break;
        case 'ItemCollectionSizeLimitExceededException':
          this.throwBadRequest('Item size exceeds the allowed limit.');
          break;
        case 'TransactionConflictException':
          this.throwBadRequest(
            'Transaction conflict detected. Retry the request.',
          );
          break;
        case 'ValidationException':
          this.throwBadRequest('Invalid request data.');
          break;
        case 'AccessDeniedException':
          this.throwInternalError('Access denied to DynamoDB.');
          break;
        case 'InternalServerError':
          this.throwInternalError('Internal error in DynamoDB.');
          break;
        default:
          this.throwInternalError(`DynamoDB error: ${error.name}`);
      }
    }

    if (error instanceof HttpException) {
      switch (error.getStatus()) {
        case 400:
          this.throwBadRequest(error.message);
          break;
        case 404:
          this.throwNotFound(error.message);
          break;
        default:
          this.throwInternalError(error.message);
          break;
      }
    }

    this.throwInternalError(`An unexpected error occurred: ${error.message}`);
  }

  private throwBadRequest(message: string): never {
    throw new BadRequestException(message);
  }

  private throwNotFound(message: string): never {
    throw new NotFoundException(message);
  }

  private throwInternalError(message: string): never {
    throw new InternalServerErrorException(message);
  }
}
