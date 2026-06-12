// About page
import Image from "next/image";
import Gavin from "./about_us_imgs/gwils018.jpg";
import Ben from "./about_us_imgs/mpham115.jpg";
import Keanu from "./about_us_imgs/kwils076.jpg";


function About() {
    return (
        <div>
            <h2 className="text-2xl font-bold my-5 ml-5">Our Mission</h2>
            {
                <p className="text-lg text-muted-foreground my-4 ml-5 indent-8">
                    With MedShare, we aim to connect patients with affordable, medical supplies provided by those who are willing to provide them. 
                    Whether it be healthcare providers with extra equipment or individuals who have spare medical supplies, we provide a secure way for them to share their excess with those who need it.
                    We are committed to creating a community that can rely on each other for support and access to life-essential medical equipment.
                    In doing so, we wish to alleviate the financial burden that can be caused by the high cost of medical equipment and provide a more financially accessible option for patients who find themselves in need of supplies.
                </p>
            }
            <h2 className="text-2xl font-bold mt-5 ml-5">How It Works</h2>
            {/* How it works content will go here */}
            <h2 className="text-2xl font-bold mt-5 ml-5">About Us</h2>
            {
                <div className="justify-center flex">
                    <div className="flex-col w-1/8 h-auto mx-25">
                        <Image src={Gavin} alt="Image of Gavin Wilson" className="rounded-lg" />
                        <p className="text-center mt-2">Gavin Wilson</p>
                    </div>
                    <div className="flex-col w-1/8 h-auto mx-25">
                        <Image src={Ben} alt="Image of Ben Pham" className="rounded-lg" />
                        <p className="text-center mt-2">Ben Pham</p>
                    </div>
                    <div className="flex-col w-1/8 h-auto mx-25">
                        <Image src={Keanu} alt="Image of Keanu Wilson" className="rounded-lg" />
                        <p className="text-center mt-2">Keanu Wilson</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default About;