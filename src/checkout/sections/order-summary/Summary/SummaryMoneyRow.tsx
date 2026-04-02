import React, { type PropsWithChildren } from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { MoneyDisplay, type MoneyDisplayProps } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface SummaryMoneyRowProps extends MoneyDisplayProps {
        label: string;
        isLoading?: boolean;
}

export const SummaryMoneyRow: React.FC<PropsWithChildren<SummaryMoneyRowProps>> = ({
        label,
        children,
        className,
        isLoading,
        ...moneyProps
}) => {
        return (
                <div className="mb-2 flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-row items-center">
                                <p color="secondary">{label}</p>
                                {children}
                        </div>
                        {isLoading ? (
                                <Skeleton className="h-4 w-16 rounded" />
                        ) : (
                                <MoneyDisplay {...moneyProps} className={cn(moneyProps.money && className)} />
                        )}
                </div>
        );
};
