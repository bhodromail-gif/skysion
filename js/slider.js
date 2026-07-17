// তোমার সব নতুন রিনেম করা ছবির পাথ (ইউনিক নাম দেওয়া হলো)
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
    setInterval(() => {
        // পরের ইনডেক্সে যাওয়ার লজিক
        currentIndex = (currentIndex + 1) % sliderImages.length;
        
        // ব্যাকগ্রাউন্ড ইমেজ পরিবর্তন এবং একই সাথে সেই লাক্সারি ব্ল্যাক-চেরি গ্রেডিয়েন্ট বজায় রাখা
        sliderElement.style.backgroundImage = `linear-gradient(180deg, rgba(11,2,3,0.2) 0%, rgba(11,2,3,0.95) 100%), url('${sliderImages[currentIndex]}')`;
    }, 4000); // প্রতি ৪ সেকেন্ড পর পর প্রিমিয়াম লুকিং স্লাইড চেঞ্জ হবে
}