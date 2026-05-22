// Search page
import { Button } from "@/components/ui/button"
import { Field, FieldSet, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

function Search() {
    return (
        <div className="pt-10 px-20">
            {/* Search form and results will go here */}
            {/* Search form */}
            <Field orientation="horizontal">
                <Input placeholder="Search..." />
                <Button>Search</Button>
            </Field>
            {/* Main content area */}
            <div className="flex mt-5">
                {/* Sidebar with filters */}
                <div className="w-1/5 pr-4">
                    {/* Filter options */}
                    <RadioGroup className={"border border-separator rounded-md p-4"}>
                        <h3>Distance</h3>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="5" id="option1" />
                            <Label htmlFor="5">Within 5 miles</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="15" id="option2" />
                            <Label htmlFor="15">Within 15 miles</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="50" id="option3" />
                            <Label htmlFor="50">Within 50 miles</Label>
                        </div>
                    </RadioGroup>
                    <FieldSet className="border border-separator rounded-md p-4 mt-4">
                        <FieldGroup className={"gap-3"}>
                            <FieldLabel>Provider Type</FieldLabel>
                            <Field orientation="horizontal">
                                <Checkbox id="medical-clinic" name="medical-clinic"/>
                                <FieldLabel htmlFor="medical-clinic">Medical Clinic</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="individual-caregivers" name="individual-caregivers"/>
                                <FieldLabel htmlFor="individual-caregivers">Individual Caregivers</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="non-profit-centers" name="non-profit-centers"/>
                                <FieldLabel htmlFor="non-profit-centers">Non-Profit Centers</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>
                {/* Search results */}
                <div className="w-4/5 pl-4">
                    <h2>Search Results</h2>
                    {/* Search results will go here */}
                    {/* Pagination controls will go here */}
                </div>
            </div>
        </div>
    );
}

export default Search;