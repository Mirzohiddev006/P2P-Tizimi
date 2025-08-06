//@ts-nocheck
// ## 🔹 1. CARD CLASS (Karta)

// ### 🎯 Maqsadi:

// Card sinfi — bu bank kartasining raqamli modeli. Har bir karta mustaqil obyekt bo‘lib, unda karta raqami, balans, egasi, xavfsizlik ma’lumotlari kabi maydonlar bo‘ladi. Bundan tashqari, u orqali asosiy operatsiyalar — pul qo‘yish, yechish, PIN o‘zgartirish va tranzaksiya tarixini yuritish amalga oshiriladi.

// ### 📌 Maydonlari (Fields):

// * number – 16 xonali noyob karta raqami.
// * expiryDate – amal qilish muddati, masalan "12/25".
// * holderName – karta egasining to‘liq ismi.
// * cvv – 3 xonali xavfsizlik kodi, faqat offline va online to‘lovlar uchun.
// * balance – joriy pul miqdori (so‘mda).
// * pin – 4 xonali maxfiy kod, karta autentifikatsiyasi uchun.
// * isActive – karta faolmi yoki bloklanganmi.
// * cardType – karta turi (VISA, MASTERCARD, HUMO, UZCARD).
// * dailyLimit – kunlik maksimal sarf limiti.
// * monthlySpent – hozirgi oyda qancha sarflangan.
// * transactionHistory – karta bo‘yicha barcha operatsiyalar ro‘yxati.

// ### ⚙️ Metodlari (Methods):
// * deposit(amount) – kartaga pul qo‘shish.
// * withdraw(amount) – kartadan pul yechish.
// * changePin(newPin) – PIN kodni yangilash.
// * block() – kartani bloklash.
// * activate() – kartani faollashtirish.
// * canSpend(amount) – berilgan miqdorni sarflash mumkinligini tekshirish.
// ---
// ### 1. deposit(amount)

// – Nima qiladi:
// Kartaga pul qo‘shadi va bu operatsiyani tranzaksiya tarixiga qo‘shadi.

// – Qachon ishlaydi:

// * amount > 0
// * card.isActive == true

// – Qachon ishlamaydi:

// * Karta bloklangan (`isActive == false`)
// * Miqdor manfiy yoki nol (`amount <= 0`)

// ---

// ### 2. withdraw(amount)

// – Nima qiladi:
// Kartadan pul yechadi, balansdan ayiradi va tranzaksiya qo‘shadi.

// – Qachon ishlaydi:

// * card.isActive == true
// * amount > 0
// * amount <= balance
// * amount <= dailyLimit
// * monthlySpent + amount <= monthlyLimit (agar mavjud bo‘lsa)

// – Qachon ishlamaydi:

// * Bloklangan karta
// * Yetarli balans yo‘q
// * Limitdan oshib ketgan
// * Miqdor manfiy yoki nol

// ---

// ### 3. changePin(newPin)

// – Nima qiladi:
// Karta PIN kodini yangilaydi.

// – Qachon ishlaydi:

// * newPin to‘g‘ri formatda (`4 xonali raqam`)

// – Qachon ishlamaydi:

// * newPin noto‘g‘ri formatda
// * Yangi PIN eski PIN bilan bir xil bo‘lsa (xohlasang bu shartni qo‘shsa bo‘ladi)

// ---

// ### 4. block()

// – Nima qiladi:
// Kartani bloklaydi (`isActive = false`)

// – Qachon ishlaydi:

// * Har qanday holatda chaqirilsa ishlaydi

// – Qachon ishlamaydi:

// * Agar karta allaqachon bloklangan bo‘lsa, foydasiz bo‘ladi (lekin xato deb hisoblanmaydi)

// ---

// ### 5. activate()

// – Nima qiladi:
// Bloklangan kartani yana faollashtiradi.

// – Qachon ishlaydi:

// * isActive == false bo‘lsa

// – Qachon ishlamaydi:

// * Agar karta allaqachon faol bo‘lsa

// ---

// ### 6. canSpend(amount)

// – Nima qiladi:
// Berilgan miqdorni sarflash mumkinligini tekshiradi.

// – Qachon ishlaydi:

// * Faqat tekshiruv uchun, hech narsa o‘zgartirmaydi
// * Shunchaki true yoki false qaytaradi

// – Qachon ishlamaydi:

// * Bu metod xato chiqarmaydi, lekin false qaytishi mumkin:

//   * Agar balans yetmasa
//   * Agar limitdan oshsa
//   * Agar karta bloklangan bo‘lsa

// ---
export class Card {
  number: string;
  expiryDate: string;
  holderName: string;
  cvv: string;
  balance: number = 0;
  pin: string;
  isActive: boolean = true;
  cardType: string;
  bank: Bank;
  dailyLimit: number = 10000000;
  monthlySpent: number = 0;
  transactionHistory: {
    type: "deposit" | "withdraw";
    amount: number;
    date: Date;
  }[] = [];

  constructor(
    number: string,
    expiryDate: string,
    holderName: string,
    cvv: string,
    pin: string,
    cardType: string,
    bank: Bank
  ) {
    this.number = number;
    this.expiryDate = expiryDate;
    this.holderName = holderName;
    this.cvv = cvv;
    this.pin = pin;
    this.cardType = cardType;
    this.bank = bank;
  }

  get isBlocked(): boolean {
    return !this.isActive;
  }

  deposit(amount: number): void {
    if (amount > 0 && this.isActive) {
      this.balance += amount;
      this.transactionHistory.push({
        type: "deposit",
        amount,
        date: new Date(),
      });
    }
  }

  withdraw(amount: number): boolean {
    if (
      this.isActive &&
      amount > 0 &&
      amount <= this.balance &&
      amount <= this.dailyLimit
    ) {
      this.balance -= amount;
      this.monthlySpent += amount;
      this.transactionHistory.push({
        type: "withdraw",
        amount,
        date: new Date(),
      });
      return true;
    }
    return false;
  }

  changePin(newPin: string): boolean {
    if (/^\d{4}$/.test(newPin) && newPin !== this.pin) {
      this.pin = newPin;
      return true;
    }
    return false;
  }

  block(): void {
    this.isActive = false;
  }

  activate(): void {
    if (!this.isActive) {
      this.isActive = true;
    }
  }

  canSpend(amount: number): boolean {
    return (
      this.isActive &&
      amount > 0 &&
      amount <= this.balance &&
      amount <= this.dailyLimit &&
      this.monthlySpent + amount <= 1000000
    );
  }
};

