import { CreditCard } from "../../../infra/database/typeorm/market-place/entities/CreditCard";
import { UserRepositoryInterface } from "../repositoryInterface/user-repository.interface";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";

export class FindCreditCardsByUserIdUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(userId: number): Promise<CreditCard[]> {
    const creditCards = await this.userRepository.findCreditCardsByUserId(
      userId
    );

    const maskedCreditCards = creditCards.map((card) => ({
      ...card,
      number: this.maskCardNumber(card.number),
      CVV: undefined,
    }));

    return maskedCreditCards;
  }

  private maskCardNumber(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 4) {
      return cardNumber;
    }

    const lastFourDigits = cardNumber.slice(-4);
    const maskedPart = "*".repeat(cardNumber.length - 4);
    return maskedPart + lastFourDigits;
  }
}

export class FindCreditCardByIdUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(id: number, userId?: number): Promise<CreditCard> {
    const creditCard = await this.userRepository.findCreditCardById(id);

    if (!creditCard) {
      throw new NotFoundError("Cartão de crédito não encontrado");
    }

    if (userId && creditCard.userId !== userId) {
      throw new UnauthenticatedError(
        "Acesso negado: cartão não pertence ao usuário"
      );
    }

    return {
      ...creditCard,
      number: this.maskCardNumber(creditCard.number),
      CVV: undefined,
    };
  }

  private maskCardNumber(cardNumber: string): string {
    if (!cardNumber || cardNumber.length < 4) {
      return cardNumber;
    }

    const lastFourDigits = cardNumber.slice(-4);
    const maskedPart = "*".repeat(cardNumber.length - 4);
    return maskedPart + lastFourDigits;
  }
}
