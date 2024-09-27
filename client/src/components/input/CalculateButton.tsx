import { montserrat } from "@/utilities/fonts";

export default function CalculateButton({
	isFetching,
}: {
	isFetching: boolean;
}) {
	return (
		<button
			className={`${montserrat.className} mt-7 text-3xl text-[#F7F7F7] rounded-md font-bold bg-[#7BB026] px-4 py-3 disabled:bg-[#B1B1B1]`}
			type="submit"
			disabled={isFetching}
		>
			Calculate
		</button>
	);
}
