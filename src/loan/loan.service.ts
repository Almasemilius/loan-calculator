import { Injectable } from '@nestjs/common';

@Injectable()
export class LoanService {
  getTotalLoanAmount(requestedAmount: number) {
    return requestedAmount;
  }

  getTotalFlatInterestAmount(
    loanAmount: number,
    tenure: number,
    interest: number,
  ) {
    const monthlyInterest = interest;

    const totalInterest = monthlyInterest * tenure * loanAmount;

    return totalInterest;
  }

  calculatePreciseInterestPerMonth(interestRate: number) {
    const monthlyInterest = interestRate * (0.01 / 12);
    return monthlyInterest;
  }

  calculateTotalPayableAmount(totalInterest: number, loanAmount: number) {
    const totalPayableAmount = totalInterest + loanAmount;
    return totalPayableAmount;
  }

  calculateFlatMonthlyRepayment(totalLoanAmount: number, tenure: number) {
    const monthlyRepayment = totalLoanAmount / tenure;
    return monthlyRepayment;
  }

  calculateReducingMonthlyRepayment(
    interest: number,
    tenure: number,
    loanAmount: number,
  ) {
    // const monthlyRepayment =
    //   (loanAmount * ((interest * (1 + interest)) ^ tenure)) /
    //   ((1 + interest) ^ (tenure - 1));

    const monthlyRepayment =
      (loanAmount * (interest * Math.pow(1 + interest, tenure))) /
      (Math.pow(1 + interest, tenure) - 1);

    // let balance = loanAmount;
    // let total_interest = 0;
    // const schedule = [];

    return monthlyRepayment;
  }

  generateFlatRepaymentSchedule(tenure: number, monthlyRepayment: number) {
    const repaymentSchedule = [];

    for (let i = 0; i < tenure; i++) {
      repaymentSchedule.push({
        installment_number: i + 1,
        repayment_amount: monthlyRepayment,
      });
    }

    return repaymentSchedule;
  }

  generateReducingRepaymentSchedule(
    tenure: number,
    loanAmount: number,
    monthlyIntetrest: number,
    monthlyPayment: number,
  ) {
    let balance = loanAmount;
    let totalInterest = 0;
    const schedule = [];
    console.log('monthlyPayment: ' + monthlyPayment);

    for (let i = 0; i < tenure; i++) {
      const interest = balance * monthlyIntetrest;
      const principalPaid = monthlyPayment - interest;
      // console.log('Balance: ' + balance);
      // console.log('Interest: ' + interest);
      // console.log('principalPaid: ' + principalPaid);

      balance -= principalPaid;
      totalInterest += interest;

      schedule.push({
        installment_number: i + 1,
        repayment_amount: monthlyPayment,
        principal: principalPaid,
        interest: interest,
        balance: balance,
      });
    }

    return { schedule, totalInterest, monthlyPayment };
  }

  getTotalFlatLoanBreakdown(tenure: number, amount: number, interest: number) {
    const requestedLoan = this.getTotalLoanAmount(amount);

    const totalInterest = this.getTotalFlatInterestAmount(
      amount,
      tenure,
      interest,
    );

    const totalPayableAmount = this.calculateTotalPayableAmount(
      totalInterest,
      requestedLoan,
    );

    const monthlyRepayment = this.calculateFlatMonthlyRepayment(
      totalPayableAmount,
      tenure,
    );

    const repaymentSchedule = this.generateFlatRepaymentSchedule(
      tenure,
      monthlyRepayment,
    );

    return {
      requested_loan: requestedLoan,
      total_interest: totalInterest,
      amount_payable: totalPayableAmount,
      monthly_repayment: monthlyRepayment,
      repayment_schedule: repaymentSchedule,
    };
  }

  getTotalReducingLoanBreakdown(
    tenure: number,
    amount: number,
    interest: number,
  ) {
    const monthlyRepayment = this.calculateReducingMonthlyRepayment(
      interest,
      tenure,
      amount,
    );

    const reducingdata = this.generateReducingRepaymentSchedule(
      tenure,
      amount,
      interest,
      this.calculateReducingMonthlyRepayment(interest, tenure, amount),
    );

    return {
      requested_loan: amount,
      total_interest: reducingdata.totalInterest,
      amount_payable: amount + reducingdata.totalInterest,
      monthly_repayment: monthlyRepayment,
      repayment_schedule: reducingdata.schedule,
    };
  }
}
