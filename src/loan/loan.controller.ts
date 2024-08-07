import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CalculateLoanChargesDto } from './calculateCharges.dto';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private loanservice: LoanService) {}

  @Post()
  getLoanBreakdown(
    @Body(new ValidationPipe())
    loanBreakdownDto: CalculateLoanChargesDto,
  ) {
    const { tenure, amount, interest, interest_type } = loanBreakdownDto;

    if (interest_type === 'Flat') {
      return this.loanservice.getTotalFlatLoanBreakdown(
        tenure,
        amount,
        this.loanservice.calculatePreciseInterestPerMonth(interest),
      );
    }

    return this.loanservice.getTotalReducingLoanBreakdown(
      tenure,
      amount,
      this.loanservice.calculatePreciseInterestPerMonth(interest),
    );
  }
}
