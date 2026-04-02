import React, { type PropsWithChildren } from "react";
import { Button, Typography } from "@components/ui";

export interface SignInFormContainerProps {
	title: string;
	redirectSubtitle?: string;
	redirectButtonLabel?: string;
	subtitle?: string;
	onSectionChange: () => void;
}

export const SignInFormContainer: React.FC<PropsWithChildren<SignInFormContainerProps>> = ({
	title,
	redirectButtonLabel,
	redirectSubtitle,
	subtitle,
	onSectionChange,
	children
}) => {
	return (
		<div className="py-4">
			<div className="mb-2 flex flex-col">
				<div className="flex flex-row items-baseline justify-between @container">
					<Typography variant="title">{title}</Typography>
					<div className="flex flex-row">
						{redirectSubtitle && (
							<p color="secondary" className="mr-2 hidden @sm:inline">
								{redirectSubtitle}
							</p>
						)}
						{redirectButtonLabel && (
							<Button
								aria-label={redirectButtonLabel}
								onClick={onSectionChange}
								variant="ghost"
							>
								{redirectButtonLabel}
							</Button>
						)}
					</div>
				</div>
				{subtitle && (
					<p color="secondary" className="mt-3">
						{subtitle}
					</p>
				)}
			</div>
			{children}
		</div>
	);
};
