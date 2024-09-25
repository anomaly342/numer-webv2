import { ChangeEvent } from "react";

export default function AnimatedFormInput({
	name,
	children,
	value,
	onChange,
}: {
	name: string;
	children: React.ReactNode;
	value: number;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="relative">
			<input
				className="bg-[#E1E1E1]  outline-transparent transition-all duration-300 py-3 px-3 outline-0 focus:outline-[#E67635] focus:outline-4 peer rounded-md text-center 
            "
				type="number"
				name={name}
				id={name}
				autoComplete="off"
				onChange={onChange}
				value={value}
				placeholder=""
				required
			/>
			<label
				className="select-none pointer-events-none whitespace-nowrap z-40 bg-[#E67635] font-bold px-2 absolute left-3 -top-[10px] text-sm text-white transition-all duration-200 peer-focus:-top-[10px] peer-focus:left-3 peer-focus:text-sm peer-focus:bg-[#E67635] peer-focus:font-bold peer-focus:px-2 peer-focus:text-white peer-focus:translate-x-0 peer-placeholder-shown:top-[11px] peer-placeholder-shown:text-base peer-placeholder-shown:left-1/2 peer-placeholder-shown:-translate-x-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:py-0 peer-placeholder-shown:text-[#7E7E7E] peer-placeholder-shown:font-normal"
				htmlFor={name}
			>
				{children}
			</label>
		</div>
	);
}
