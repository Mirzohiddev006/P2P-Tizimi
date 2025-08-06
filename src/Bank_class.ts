//@ts-nocheck
// ## 🔹 2. BANK CLASS (Bank)

import type { Card } from "./Card_class";

// ### 🎯 Maqsadi:

// Bank sinfi — butun bankni ifodalaydi. U bir nechta kartalarni boshqaradi, ularning balansini nazorat qiladi, o‘ziga xos komissiyalarni qo‘llaydi va umumiy moliyaviy holatini yuritadi.

// ### 📌 Maydonlari:

// * name – bank nomi.
// * bankCode – bank kodi (masalan, "HB001").
// * totalBalance – bankdagi barcha kartalar balansining yig‘indisi.
// * cards – shu bankka tegishli barcha kartalar ro‘yxati.
// * transactionFee – har bir tranzaksiya uchun komissiya (foiz ko‘rinishida, masalan 0.5%).

// ### ⚙️ Metodlari:

// * addCard(card) – bankga yangi karta qo‘shish.
// * getCardByNumber(number) – karta raqami orqali karta topish.
// * transfer(fromCard, toCard, amount) – bank ichidagi kartalar o‘rtasida pul o‘tkazish.
// * calculateTotalBalance() – barcha kartalar balansini hisoblab chiqish.

// ---

// ---

// ### 1. addCard(card)

// – Nima qiladi:
// Yangi kartani bank tizimiga qo‘shadi.

// – Qachon ishlaydi:

// * Agar karta raqami noyob bo‘lsa (optional check)
// * Har qanday faol yoki nofaol karta

// – Qachon ishlamaydi:

// * Agar karta tizimda allaqachon mavjud bo‘lsa (agar tekshiruv qilinayotgan bo‘lsa)

// ---

// ### 2. getCardByNumber(number)

// – Nima qiladi:
// Berilgan raqam bo‘yicha kartani topadi.

// – Qachon ishlaydi:

// * Agar karta mavjud bo‘lsa

// – Qachon ishlamaydi:

// * Agar karta raqami bazada bo‘lmasa

// ---

// ### 3. transfer(fromCard, toCard, amount)

// – Nima qiladi:
// Bir bankdagi ikkita karta o‘rtasida pul o‘tkazadi.

// – Qachon ishlaydi:

// * Ikkala karta faol bo‘lsa
// * `fromCard`da yetarli balans bo‘lsa
// * Limitdan oshmagan bo‘lsa
// * amount > 0

// – Qachon ishlamaydi:

// * Ikkaladan biri bloklangan bo‘lsa
// * fromCard.balance < amount
// * Limitdan oshsa

// ---

// ### 4. calculateTotalBalance()

// – Nima qiladi:
// Barcha kartalarning balansini yig‘ib, totalBalance qiymatini yangilaydi.

// – Qachon ishlaydi:

// * Har doim ishlaydi, faqat hisob-kitob qiladi

// – Qachon ishlamaydi:

// * Xato chiqarmaydi, lekin kartalar bo‘sh bo‘lsa natija 0 bo‘ladi

// ---

export class Bank {
  name: string;
  bankCode: string;
  totalBalance: number = 0;
  cards: Card[] = [];
  transactionFee: number = 0.005; // 0.5%

  constructor(name: string, bankCode: string) {
    this.name = name;
    this.bankCode = bankCode;
  }

  addCard(card: Card): void {
    if (!this.cards.some((c) => c.number === card.number)) {
      this.cards.push(card);
      this.calculateTotalBalance();
    }
  }

  getCardByNumber(number: string): Card | undefined {
    return this.cards.find((card) => card.number === number);
  }

  transfer(fromCard: Card, toCard: Card, amount: number): boolean {
    if (fromCard.canSpend(amount) && toCard.isActive && amount > 0) {
      const fee = this.calculateFee(amount);
      if (fromCard.balance >= amount + fee) {
        fromCard.balance -= amount + fee;
        fromCard.monthlySpent += amount;

        toCard.balance += amount;

        fromCard.transactionHistory.push({
          type: "withdraw",
          amount: amount + fee,
          date: new Date(),
        });

        toCard.transactionHistory.push({
          type: "deposit",
          amount,
          date: new Date(),
        });

        this.calculateTotalBalance();
        return true;
      }
    }
    return false;
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.cards.reduce((sum, card) => sum + card.balance, 0);
  }

  calculateFee(amount: number): number {
    return amount * this.transactionFee;
  }
};
