// Search page
import { Button } from "@/components/ui/button"
import { Field, FieldSet, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Toggle } from "@/components/ui/toggle"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Search, DollarSignIcon, StarIcon } from "lucide-react"

function SearchPage() {
    return (
        <div className="pt-10 px-20">
            {/* Search form */}
            <Field orientation="horizontal">
                <InputGroup>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search..." />
                </InputGroup>
                <Button>Search</Button>
            </Field>
            {/* Main content area */}
            <div className="flex mt-5">
                {/* Sidebar with filters */}
                <div className="w-1/5 pr-4">
                    {/* Filter options */}
                    <FieldSet className="border border-separator rounded-md p-4">
                        <FieldLabel>Distance</FieldLabel>
                        <RadioGroup className="space-y-2">
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="within-5" id="within-5" />
                                <Label htmlFor="within-5">Within 5 miles</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="within-15" id="within-15" />
                                <Label htmlFor="within-15">Within 15 miles</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="within-50" id="within-50" />
                                <Label htmlFor="within-50">Within 50 miles</Label>
                            </div>
                        </RadioGroup>
                    </FieldSet>
                    <FieldSet className="border border-separator rounded-md p-4 mt-4">
                        <FieldGroup className={"gap-3"}>
                            <FieldLabel>Price Range (Daily)</FieldLabel>
                            <Field orientation="horizontal">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <DollarSignIcon />
                                    </InputGroupAddon>
                                    <InputGroupInput placeholder="Min" />
                                </InputGroup>
                                <span>to</span>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <DollarSignIcon />
                                    </InputGroupAddon>
                                    <InputGroupInput placeholder="Max" />
                                </InputGroup>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="borrow" name="borrow" />
                                <FieldLabel htmlFor="borrow">Available to Borrow</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet className="border border-separator rounded-md p-4 mt-4">
                        <FieldGroup className={"gap-3"}>
                            <FieldLabel>Provider Type</FieldLabel>
                            <Field orientation="horizontal">
                                <Checkbox id="medical-clinic" name="medical-clinic" />
                                <FieldLabel htmlFor="medical-clinic">Medical Clinic</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="individual-caregivers" name="individual-caregivers" />
                                <FieldLabel htmlFor="individual-caregivers">Individual Caregivers</FieldLabel>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="non-profit-centers" name="non-profit-centers" />
                                <FieldLabel htmlFor="non-profit-centers">Non-Profit Centers</FieldLabel>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Toggle className="mt-4 w-full" id="verified" name="verified" variant="outline">
                        Verified Providers Only
                    </Toggle>
                </div>
                {/* Search results */}
                <div className="w-4/5 pl-4">
                    {/* Search results as 3 column grid of cards */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Repeat for each search result on page */}
                        {[...Array(6)].map((_, index) => (
                        <Card className="relative mx-auto w-full" key={index}>
                            {/* Placeholder image */}
                            <img
                                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                                src="https://avatar.vercel.sh/shadcn1"
                                alt=""
                            />
                            <CardHeader>
                                <CardTitle>Equipment Name</CardTitle>
                                <CardDescription>
                                    <div>
                                        Listing description details...
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">$20/day</span>
                                        <span className="flex-grow"></span>
                                        <span className="ml-4 text-sm text-muted-foreground flex items-center gap-1">
                                            <StarIcon className="w-4 h-4 fill-primary text-primary" />
                                            Rating: 4.5
                                        </span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button>View Details</Button>
                                <span className="ml-auto text-sm text-muted-foreground">Provider Name</span>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                    {/* Pagination controls */}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;