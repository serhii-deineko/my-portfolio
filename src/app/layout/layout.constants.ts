import { SocialIconName } from "../shared/ui/social-icon/social-icon";

export interface ContactChannel {
	readonly id: SocialIconName;
	readonly label: string;
	readonly value: string;
	readonly href: string;
}

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
	{
		id: "gmail",
		label: "Email",
		value: "serhii.deineko@gmail.com",
		href: "mailto:serhii.deineko@gmail.com"
	},
	{
		id: "telegram",
		label: "Telegram",
		value: "t.me/serhiideineko",
		href: "https://t.me/serhiideineko"
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		value: "wa.me/48662412980",
		href: "https://wa.me/48662412980"
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		value: "linkedin.com/in/serhii-deineko",
		href: "https://www.linkedin.com/in/serhii-deineko/"
	},
	{
		id: "github",
		label: "GitHub",
		value: "github.com/serhii-deineko",
		href: "https://github.com/serhii-deineko/"
	}
];
