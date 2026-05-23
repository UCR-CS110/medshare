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
  return (
    <div className="flex px-20">
      <div className="w-1/2">
        <h1 className="text-6xl font-bold line-clamp-3">Find or Share <span className="text-green-800">Life-Essential</span> Medical Equipment</h1>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <Field orientation="horizontal">
            <Input className="min-w-64" placeholder="Desired Equipment" />
            <Input className="min-w-64" placeholder="Location" />
            <Button>Search</Button>
          </Field>
        </FieldGroup>
      </div>
      <div className="w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Home;
