"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Link from "next/link";


export default function FloatingFooter() {
  const { cart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load saved info from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("receipt_name");
    const savedPhone = localStorage.getItem("receipt_phone");
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );
  const totalLeads = cart.reduce((acc, item) => acc + Number(item.numbers), 0);

  const isCheckoutDisabled =
    cart.length === 0 || name.trim() === "" || phone.trim() === "";

  const handleCheckout = () => {
    // Save only when Checkout button is clicked
    localStorage.setItem("receipt_name", name);
    localStorage.setItem("receipt_phone", phone);
  };

  return (
    <div className="lg:hidden w-full  px-4 py-2 border-t bg-gray-50 fixed bottom-0 z-10">
      <div className="space-y-1 mb-1">
        <div className="flex items-center gap-0.5">
          <h1 className="font-semibold text-sm">Receipt Info</h1>
          <span className="text-red-500 text-xs">(Required)</span>
        </div>
        <Input
          className="border border-blue-600 text-xs"
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="border border-blue-600 text-xs"
          type="number"
          placeholder="Enter Your WhatsApp Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        
        <p className="flex justify-between text-sm font-bold">
          <span>Total Leads:</span>
          <span>{totalLeads}</span>
        </p>
        <p className="flex justify-between text-sm font-bold">
          <span>Total Price:</span>
          <span>BDT {total.toFixed(2)}</span>
        </p>
        <Link href={isCheckoutDisabled ? "#" : "/checkout"}>
          <button
            onClick={handleCheckout}
            disabled={isCheckoutDisabled}
            className={`mt-2 w-full py-2 rounded text-white text-xs ${
              isCheckoutDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
