// হিরো স্লাইডার ইমেজ পাথগুলো
const sliderImages = [
    'images/img/hero/hero-1.jpg',
    'images/img/hero/hero-2.jpg',
    'images/img/hero/hero-3.jpg',
    'images/img/hero/hero-4.jpg',
    'images/img/hero/hero-5.jpg'
];

let currentIndex = 0;
const sliderElement = document.getElementById('hero-slider');

if (sliderElement) {
    // পেজ লোড হওয়ার সাথে সাথেই প্রথম ব্যাকগ্রাউন্ড ইমেজ ও গ্রেডিয়েন্ট সেট করে নেওয়া
    sliderElement.style.backgroundImage = `linear-gradient(180deg, rgba(11,2,3,0.2) 0%, rgba(11,2,3,0.95) 100%), url('${sliderImages[currentIndex]}')`;

    // ব্যাকগ্রাউন্ড ইমেজ স্মুথ করার জন্য ট্রানজিশন যোগ করতে চাইলে CSS-এ লিখে নিতে পারো
    // যেমন: #hero-slider { transition: background-image 1s ease-in-out; }

    setInterval(() => {
        // পরের ইনডেক্সে যাওয়ার লজিক
        currentIndex = (currentIndex + 1) % sliderImages.length;
        
        // ব্যাকগ্রাউন্ড ইমেজ পরিবর্তন এবং লাক্সারি ব্ল্যাক-চেরি গ্রেডিয়েন্ট বজায় রাখা
        sliderElement.style.backgroundImage = `linear-gradient(180deg, rgba(11,2,3,0.2) 0%, rgba(11,2,3,0.95) 100%), url('${sliderImages[currentIndex]}')`;
    }, 4000); // প্রতি ৪ সেকেন্ড পর পর স্লাইড চেঞ্জ হবে
}