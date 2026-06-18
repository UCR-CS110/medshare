"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch() {
    if (!searchQuery.trim()) {
      return;
    }
    // Redirect to search results page with query parameters
    router.push(`/search?query=${searchQuery}`);
  }

  return (
    <div>
      <div className="flex px-20">
        <div className="w-1/2 my-6">
          <h1 className="text-6xl font-bold line-clamp-3">Find or Share <span className="text-green-800">Life-Essential</span> Medical Equipment</h1>
          <p className="text-lg text-muted-foreground my-4"> Connecting patients with affordable, pre-vetted medical supplies. Secure, clinical-grade logistics and a community built on trust.</p>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field orientation="horizontal">
              <Input 
                className="min-w-64" 
                placeholder="Desired Equipment" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Field>
          </FieldGroup>
        </div>
        <div className="w-1/2 flex items-center justify-center my-6">
          <img src="home/stockphoto_seniorcitizen.png" alt="Placeholder Image"/>
        </div>
      </div>
      <div className="px-20 my-20">
        <div className="w-1/2 my-6">
          <h2 className="text-2xl">Browse by Category</h2>
          <p className="text-sm text-muted-foreground my-4">Clinically audited equipment across all vital care sectors.</p>
        </div>
        <div className="flex">
          <Card className="flex items-center justify-center w-3/5 mr-4">
            <img src="https://placehold.co/800x600/black/white" alt="Placeholder Image" className="w-fill h-fill" />
          </Card>
          <div className="ml-4 w-2/5">
            <Card className="flex items-center justify-center h-1/2">
              <img src="https://placehold.co/533x300/black/white" alt="Placeholder Image" className="w-fill h-fill" />
            </Card>
            <Card className="flex items-center justify-center h-1/2">
              <img src="https://placehold.co/533x300/black/white" alt="Placeholder Image" className="w-fill h-fill" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
