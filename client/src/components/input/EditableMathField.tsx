import { useEffect, SetStateAction } from "react";
import dynamic from "next/dynamic";

const EditableMathField = dynamic(
	() => import("react-mathquill").then((mod) => mod.EditableMathField),
	{ ssr: false }
);

export default function MathField({
	latex,
	setLatex,
}: {
	latex: string;
	setLatex: React.Dispatch<SetStateAction<string>>;
}) {
	useEffect(() => {
		import("react-mathquill").then((mq) => {
			mq.addStyles();
		});
	}, []);

	return (
		<EditableMathField
			className="py-2 px-3    !rounded-md no-border !shadow-none"
			latex={latex}
			onChange={(mathField) => {
				setLatex(mathField.latex());
			}}
		/>
	);
}
