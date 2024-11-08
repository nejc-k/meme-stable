import GenerateForm from "../components/GenerateForm";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import Link from "next/link";

export default async function Page() {

	return (
		<>
 		<MaxWidthWrapper>
        <div className="flex flex-col mt-10">
            <h1 className="text-2xl-">Generate</h1>
            <GenerateForm/>
		</div>     
		
 		</MaxWidthWrapper>
		</>
	);
}