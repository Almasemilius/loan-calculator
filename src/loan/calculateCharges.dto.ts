import { IsNotEmpty, IsNumber, Min } from 'class-validator';
export class CalculateLoanChargesDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  tenure: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  interest: number;

  interest_type: 'Flat' | 'Reducing';
}
