"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CreateListingForm({
    className,
    ...props
}) {

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");
        const dailyRate = formData.get("dailyRate");
        const location = formData.get("location");
        const images = formData.getAll("images");
    
        // Show error if login failed
        if (!title || !description || !dailyRate || !location) {
          alert("Please fill in all required fields.");
          return;
        }
      }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <Input name="title" placeholder="Title" required />
                <Input name="description" placeholder="Description" required />
                <Input name="dailyRate" type="number" placeholder="Daily Rate" required />
                <Input name="location" placeholder="Location" required />
                <Input name="images" type="file" multiple accept="image/*" />
                <Button type="submit">Create Listing</Button>
            </form>
        </div>
    );
}