"use client";
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
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
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { Search, DollarSignIcon, StarIcon } from "lucide-react"
import Link from "next/link"




function SearchPage() {
    const [listings, setListings] = useState([]);
    const [query, setQuery] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [verified, setVerified] = useState(false);
    const [providerTypes, setProviderTypes] = useState([]);

    function fetchListings() {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (verified) params.set("verified", "true");
        if (providerTypes.length > 0) params.set("providerType", providerTypes[0]);

        fetch(`/api/listings?${params.toString()}`)
            .then(r => r.json())
            .then(data => setListings(Array.isArray(data) ? data : []));
    }

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <div className="pt-10 px-20">
            {/* Search form */}
            <Field orientation="horizontal">
                <InputGroup>
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupInput 
                    placeholder="Search..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                </InputGroup>
                <Button onClick={fetchListings}>Search</Button>
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
                                    <InputGroupInput placeholder="Min" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)} />
                                </InputGroup>
                                <span>to</span>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <DollarSignIcon />
                                    </InputGroupAddon>
                                    <InputGroupInput placeholder="Max" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)} />
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
                            {[
                                { id: "medical-clinic", label: "Medical Clinic" },
                                { id: "individual-caregiver", label: "Individual Caregivers" },
                                { id: "non-profit-center", label: "Non-Profit Centers" },
                            ].map(({ id, label }) => (
                                <Field orientation="horizontal" key={id}>
                                    <Checkbox
                                        id={id}
                                        checked={providerTypes.includes(id)}
                                        onCheckedChange={(checked) => {
                                            setProviderTypes(prev =>
                                                checked ? [...prev, id] : prev.filter(t => t !== id)
                                            );
                                        }}
                                    />
                                    <FieldLabel htmlFor={id}>{label}</FieldLabel>
                                </Field>
                            ))}
                        </FieldGroup>
                    </FieldSet>
                    <Toggle className="mt-4 w-full" variant="outline" pressed={verified} onPressedChange={(val)=>setVerified(val)}>
                        Verified Providers Only
                    </Toggle>
                </div>
                {/* Search results */}
                <div className="w-4/5 pl-4">
                    {/* Search results as 3 column grid of cards */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Repeat for each search result on page */}
                        {listings.map((listing) => (
    <Card className="relative mx-auto w-full" key={listing._id}>
        <div className="aspect-video w-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            Image
        </div>
        <CardHeader>
            <CardTitle>{listing.title}</CardTitle>
            <CardDescription>
                <div>{listing.description}</div>
                <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">${listing.dailyRate}/day</span>
                    <span className="flex-grow"></span>
                    <span className="text-sm text-muted-foreground">{listing.location}</span>
                </div>
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button asChild>
                <Link href={`/listings/${listing._id}`}>View Details</Link>
            </Button>
            <span className="ml-4 text-sm text-muted-foreground flex items-center gap-1">
                <StarIcon className="w-4 h-4 fill-primary text-primary" />
                {listing.avgRating ? `${listing.avgRating} (${listing.reviewCount})` : "No reviews"}
            </span>
        </CardFooter>
    </Card>
))}
                    </div>
                    {/* Pagination controls */}
                    <Pagination className="mt-6" aria-label="Search results pagination">
                        <PaginationContent>
                            <PaginationPrevious>
                                Previous
                            </PaginationPrevious>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationEllipsis />
                            <PaginationItem>
                                <PaginationLink href="#">10</PaginationLink>
                            </PaginationItem>
                            <PaginationNext>
                                Next
                            </PaginationNext>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;