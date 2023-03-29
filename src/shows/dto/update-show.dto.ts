import { PartialType } from '@nestjs/mapped-types';
import { CreateShowDto } from './create-show.dto';

export class UpdateShowDto extends PartialType(CreateShowDto) {}
