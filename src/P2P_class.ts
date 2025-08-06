//@ts-nocheck
// ## 🔹 3. P2P CLASS (Peer-to-Peer tizim)

// ### 🎯 Maqsadi:

// P2P sinfi — bu turli banklar o‘rtasida to‘g‘ridan-to‘g‘ri pul o'tkazmalarini amalga oshiruvchi tizim. U orqali foydalanuvchi HamkorBank'dan AsakaBank'ga to‘lov qilishi mumkin.

// ### 📌 Maydonlari:

// * supportedBanks – P2P tizimida ishlashga ruxsat berilgan banklar ro‘yxati.
// * transactionHistory – barcha P2P orqali amalga oshirilgan tranzaksiyalar.
// * dailyTransactionLimit – har bir foydalanuvchi uchun kunlik maksimal o'tkazma limiti.
// * serviceFee – P2P komissiyasi (masalan, 0.2%).

// ### ⚙️ Metodlari:

// * registerBank(bank) – yangi bankni P2P tizimiga qo‘shish.
// * send(fromCard, toCard, amount) – har xil banklar o‘rtasida pul yuborish.
// * validateTransaction(fromCard, toCard, amount) – tranzaksiyani tekshirish.
// * calculateFee(amount) – xizmat uchun komissiyani hisoblash.

// ---

// ### 1. registerBank(bank)

// – Nima qiladi:
// Yangi bankni P2P tizimiga qo‘shadi.

// – Qachon ishlaydi:

// * Agar bank tizimda mavjud bo‘lmasa

// – Qachon ishlamaydi:

// * Bank allaqachon qo‘shilgan bo‘lsa

// ---

// ### 2. send(fromCard, toCard, amount)

// – Nima qiladi:
// Turli banklardagi kartalar o‘rtasida pul o‘tkazadi (P2P operatsiyasi).

// – Qachon ishlaydi:

// * Ikkala bank supportedBanks ichida bo‘lsa
// * Ikkala karta faol bo‘lsa
// * fromCard.balance >= amount
// * Limit va komissiya hisobga olingan bo‘lsa

// – Qachon ishlamaydi:

// * Banklardan biri qo‘llab-quvvatlanmasa
// * Limitdan oshsa
// * Balans yetarli bo‘lmasa
// * Kartalardan biri bloklangan bo‘lsa

// ---

// ### 3. validateTransaction(fromCard, toCard, amount)

// – Nima qiladi:
// Tranzaksiya mumkinmi yoki yo‘qligini oldindan tekshiradi. Bu metod hech qanday operatsiya qilmaydi, faqat holatni aniqlaydi.

// – Qachon ishlaydi:

// * Har doim, faqat tekshiradi

// – Qachon ishlamaydi:

// * Natija false bo‘lishi mumkin yuqoridagi shartlar buzilganda

// ---

// ### 4. calculateFee(amount)

// – Nima qiladi:
// Berilgan miqdor bo‘yicha P2P komissiyasini hisoblaydi.

// – Qachon ishlaydi:

// * Har doim ishlaydi

// – Qachon ishlamaydi:

// * Xato bermaydi, lekin noto‘g‘ri miqdor (masalan, manfiy son) kiritilsa, natija ham noto‘g‘ri bo‘lishi mumkin

export class P2P {
  supportedBanks: Bank[] = [];
  transactionHistory: P2PTransaction[] = [];
  dailyTransactionLimit: number = 1000000; // 1 million so'm
  serviceFee: number = 0.002; // 0.2%
  private dailyTransactions: { [key: string]: number } = {};

  registerBank(bank: Bank): void {
    if (!this.supportedBanks.includes(bank)) {
      this.supportedBanks.push(bank);
    }
  }
  send(fromCard: Card, toCard: Card, amount: number): P2PTransactionResult {
    if (!this.validateTransaction(fromCard, toCard, amount)) {
      return { success: false, error: "Transaction validation failed" };
    }

    const fee = this.calculateFee(amount);
    const totalAmount = amount + fee;

    fromCard.balance -= totalAmount;
    toCard.balance += amount;

    const transaction: P2PTransaction = {
      id: Date.now().toString(),
      type: "P2P",
      amount,
      date: new Date(),
      status: "completed",
      fromCardNumber: fromCard.number,
      toCardNumber: toCard.number,
      fromBankCode: fromCard.bank.bankCode,
      toBankCode: toCard.bank.bankCode,
    };

    this.transactionHistory.push(transaction);

    this.dailyTransactions[fromCard.number] =
      (this.dailyTransactions[fromCard.number] || 0) + totalAmount;

    return { success: true, transactionId: transaction.id };
  }

  validateTransaction(fromCard: Card, toCard: Card, amount: number): boolean {
    if (
      !this.supportedBanks.includes(fromCard.bank) ||
      !this.supportedBanks.includes(toCard.bank)
    ) {
      return false;
    }

    if (!fromCard.isActive || !toCard.isActive) {
      return false;
    }

    if (fromCard.balance < amount) {
      return false;
    }

    const spentToday = this.dailyTransactions[fromCard.number] || 0;

    if (spentToday + amount > this.dailyTransactionLimit) {
      return false;
    }

    return true;
  }

  calculateFee(amount: number): number {
    return amount * this.serviceFee;
  }
};


