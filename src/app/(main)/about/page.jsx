// About page
import Image from "next/image";
import Gavin from "./about_us_imgs/gwils018.jpg";
import Ben from "./about_us_imgs/mpham115.jpg";
import Keanu from "./about_us_imgs/kwils076.jpg";


function About() {
    return (
        <div>
            <div>
                <h1 className="text-5xl font-bold line-clamp-3 text-center mt-10 text-green-800">About MedShare</h1>
            </div>
            <h2 className="text-2xl font-bold my-5 ml-5">Our Mission</h2>
            {
                <p className="text-lg text-muted-foreground my-4 ml-5 indent-8">
                    With MedShare, we aim to connect patients with affordable medical supplies provided by those who are willing to provide them. 
                    Whether it be healthcare providers with extra equipment or individuals who have spare medical supplies, we provide a secure way for them to share their excess with those who need it.
                    We are committed to creating a community that can rely on each other for support and access to life-essential medical equipment.
                    In doing so, we wish to alleviate the financial burden that can be caused by the high cost of medical equipment and provide a more financially accessible option for patients who find themselves in need of supplies.
                </p>
            }
            <h2 className="text-2xl font-bold mt-5 ml-5">How It Works</h2>
            {
                <div className="text-lg text-muted-foreground my-4 ml-5 indent-8">
                    MedShare provides different options for both those who are looking to share their excess medical equipment and those who are searching for affordable medical equipment:
                    <br />
                    <h1 className="txt-xl font-bold mt-5 ml-5">For Customers:</h1>
                        <ul className="indent-16">
                            <li>Search for medical equipment sorted by location, price, and provider type.</li>
                            <li>Connect with verified providers to rent equipment.</li>
                            <li>Reduce costs associated with purchasing and maintaining new equipment.</li>
                        </ul>
                    <h1 className="txt-xl font-bold mt-5 ml-5">For Providers:</h1>
                        <ul className="indent-16">
                            <li>List your excess medical equipment for free.</li>
                            <li>Connect with customers in need of equipment.</li>
                            <li>Earn money by sharing your excess medical supplies.</li>
                        </ul>
                </div>
            }
            <h2 className="text-2xl font-bold mt-5 ml-5">About Us</h2>
            {
                <div>
                    <div className="justify-center flex">
                        <div className="flex-col w-1/8 h-auto mx-25">
                            <Image src={Gavin} alt="Image of Gavin Wilson" className="rounded-lg" />
                            <p className="text-center mt-2 text-green-800 font-bold">Gavin Wilson</p>
                        </div>
                        <div className="flex-col w-1/8 h-auto mx-25">
                            <Image src={Ben} alt="Image of Ben Pham" className="rounded-lg" />
                            <p className="text-center mt-2 text-green-800 font-bold">Ben Pham</p>
                        </div>
                        <div className="flex-col w-1/8 h-auto mx-25">
                            <Image src={Keanu} alt="Image of Keanu Wilson" className="rounded-lg" />
                            <p className="text-center mt-2 text-green-800 font-bold">Keanu Wilson</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mt-5 ml-5 indent-8">Gavin Wilson</h3>
                            <p className="text-lg text-muted-foreground my-4 ml-5 indent-16">

                            </p>
                        <h3 className="text-xl font-bold mt-5 ml-5 indent-8">Ben Pham</h3>
                            <p className="text-lg text-muted-foreground my-4 ml-5 indent-16">
                            
                            </p>
                        <h3 className="text-xl font-bold mt-5 ml-5 indent-8">Keanu Wilson</h3>
                            <p className="text-lg text-muted-foreground my-4 ml-5 indent-16">
                            
                            </p>
                    </div>
                </div>
            }
        </div>
    );
}

export default About;