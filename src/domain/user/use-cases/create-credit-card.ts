import { CreditCard } from "../../../infra/database/typeorm/market-place/entities/CreditCard";
import { BusinessError } from "../../../shared/errors/business.error";
import { UserRepositoryInterface } from "../repositoryInterface/user-repository.interface";

export interface CreateCreditCardUseCaseParams {
  userId: number;
  titularName: string;
  number: string;
  CVV: number;
  value: number;
  expirationDate: Date;
}

export class CreateCreditCardUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(params: CreateCreditCardUseCaseParams): Promise<CreditCard> {
    const { userId, titularName, number, CVV, value, expirationDate } = params;

    const creditCard = await this.userRepository.createCreditCard({
      userId,
      titularName: titularName.trim(),
      number: number.replace(/\s/g, ""),
      CVV,
      value,
      expirationDate,
    });

    return creditCard;
  }
}
