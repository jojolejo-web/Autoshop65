"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { updateCartItemQuantity } from "./action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CartQuantitySelectProps = {
  cartItemId: number;
  initialQuantity: number;
  stock: number;
};

export default function CartQuantitySelect({
  cartItemId,
  initialQuantity,
  stock,
}: CartQuantitySelectProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(String(initialQuantity));

  return (
    <Select
      value={quantity}
      onValueChange={(value) => {
        setQuantity(value);

        startTransition(async () => {
          await updateCartItemQuantity(cartItemId, Number(value));
          router.refresh();
        });
      }}
    >
      <SelectTrigger className="w-full max-w-38 ">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Quantite</SelectLabel>
          {Array.from({ length: stock }, (_, index) => index + 1).map(
            (itemQuantity) => (
              <SelectItem
                key={itemQuantity}
                value={String(itemQuantity)}
              >
                {itemQuantity}
              </SelectItem>
            ),
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
