import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "../../store/slices/crmSlice";
import { DollarSign, IndianRupee } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";

const CurrencySelector = () => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state) => state.crm);

  const currencies = [
    {
      value: "USD",
      label: "USD",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      value: "INR",
      label: "INR",
      icon: <IndianRupee className="h-4 w-4" />,
    },
  ];

  const activeCurrency = currencies.find((c) => c.value === currency);

  const handleCurrencyChange = (newCurrency) => {
    dispatch(setCurrency(newCurrency));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {activeCurrency?.icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.value}
            onClick={() => handleCurrencyChange(c.value)}
            className="flex items-center gap-2"
          >
            {c.icon}
            <span>{c.label}</span>
            {c.value === currency && (
              <span className="ml-auto h-1.5 w-1.5 fill-current bg-foreground rounded-full"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
