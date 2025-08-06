//@ts-nocheck
import { Card } from "./Card_class";
import { Bank } from "./Bank_class";
import { P2P } from "./P2P_class";

// ## 🔹 5. INTERFACE LAR

// ### 📘 Transaction:

// Har qanday tranzaksiyaning asosiy strukturasini ifodalaydi:

// * id
// * tur (TransactionType)
// * miqdor
// * sana
// * status
// * izoh (ixtiyoriy)

// ### 📘 P2PTransaction:

// P2P tranzaksiyalarning kengaytirilgan ko‘rinishi:

// * Asosiy transaction ma’lumotlari
// * Qo‘shimcha tarzda fromCardNumber, toCardNumber, fromBankCode, toBankCode mavjud

// ### 📘 ValidationResult:

// Har qanday tekshiruv natijasini bildiradi:

// * muvaffaqiyatli yoki yo‘q
// * xato xabari (agar mavjud bo‘lsa)

// ### 📘 P2PTransactionResult:

// P2P orqali yuborilgan tranzaksiya natijasini bildiradi:
// * muvaffaqiyatli yoki yo‘q
// * tranzaksiya ID (agar muvaffaqiyatli bo‘lsa)
// * xatolik sababi (agar muvaffaqiyatsiz bo‘lsa)

// ---

// ## 🔗 6. OBYEKTLAR O‘RTASIDAGI ALOQA

// * Bank ↔ Card:
//   Har bir bankda ko‘plab kartalar bo‘ladi. Karta faqat bitta bankga tegishli bo‘ladi.

// * Bank ↔ P2P:
//   P2P bir nechta bankni qo‘llab-quvvatlaydi. Banklar bu tizim orqali o‘zaro aloqa qiladi.

// * Card ↔ P2P:
//   Turli banklardagi kartalar P2P orqali bir-biriga pul yubora oladi.

const bankA = new Bank("Kapitalbank", "KB001");
const bankB = new Bank("Hamkorbank", "HB002");

const card1 = new Card(
  "8600123412341234", // <-- 16 xonali karta raqami
  "12/26",
  "Ali",
  "123",
  "1111",
  "Visa",
  bankA
);

const card2 = new Card(
  "9860543298765432", // <-- 16 xonali karta raqami
  "11/27",
  "Vali",
  "456",
  "2222",
  "Mastercard",
  bankB
);

card2.deposit(500000);

bankA.addCard(card1);
bankB.addCard(card2);

const p2p = new P2P();
p2p.registerBank(bankA);
p2p.registerBank(bankB);

// Check
function showCheck(from: string, to: string, amount: number) {
  const modal = document.getElementById("checkModal");
  if (modal) {
    modal.querySelector(
      "p:nth-child(2)"
    )!.textContent = `Jo‘natuvchi: **** **** **** ${from.slice(-4)}`;
    modal.querySelector(
      "p:nth-child(3)"
    )!.textContent = `Qabul qiluvchi: **** **** **** ${to.slice(-4)}`;
    modal.querySelector(
      "p:nth-child(4)"
    )!.textContent = `Miqdor: ${amount} so‘m`;
    modal.classList.remove("hidden");
  }
};
