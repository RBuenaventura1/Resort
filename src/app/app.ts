import { Component, signal, ElementRef, ViewChild, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // <-- Added isPlatformBrowser
import { FormsModule } from '@angular/forms';

interface Room {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface Experience {
  id: string;
  title: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private platformId = inject(PLATFORM_ID); // <-- Injected Platform ID

  // Navigation Sections Tracking
  sections = ['hero', 'experiences', 'accommodations', 'reserve'];
  activeSection = signal<string>('hero');

  // Reservation Form Model
  bookingData = {
    guestName: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  };

  isSubmitted = signal<boolean>(false);

  // Experiences Data
  experiences: Experience[] = [
    {
      id: 'resort',
      title: 'Resort',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      description: 'Immerse yourself in world-class amenities surrounded by tropical grounds.'
    },
    {
      id: 'villa',
      title: 'Villa',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      description: 'Private sanctuaries featuring infinity pools and panoramic ocean views.'
    },
    {
      id: 'penthouse',
      title: 'Penthouse',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'Top-tier luxury with wrap-around terraces and dedicated butler service.'
    },
    {
      id: 'beach',
      title: 'The Private Beach',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'Pristine white sands reserved exclusively for our guests.'
    },
    {
      id: 'apartment',
      title: 'Apartment',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      description: 'Elegant multi-room residences designed for family luxury.'
    }
  ];

  selectedExperience = signal<Experience>(this.experiences[1]);

  // Featured Rooms Carousel Data
  featuredRooms: Room[] = [
    {
      id: 1,
      title: 'Ocean Front Lanai',
      description: 'Elevate your stay in our premium oceanfront guestroom with private balcony.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'Beach Front Villa',
      description: 'Where sun, sea, and sand come together, just steps from the shoreline.',
      price: 480,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Dolphin Lanai',
      description: 'Watch marine life play in our private lagoon from the comfort of your patio.',
      price: 520,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Golf Mountain Suite',
      description: 'Sweeping fairway views surrounded by lush tropical mountain scenery.',
      price: 410,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    }
  ];

  activeRoomIndex = signal<number>(1);

  ngAfterViewInit() {
    // Only execute browser API if running inside the browser
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  // Scroll to section handler
  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Detect current active snap section using IntersectionObserver
  private setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    const options = {
      root: null,
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    this.sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Experience Selection
  selectExperience(exp: Experience) {
    this.selectedExperience.set(exp);
  }

  // 3D Carousel Handlers
  nextCard() {
    this.activeRoomIndex.update(idx => (idx + 1) % this.featuredRooms.length);
  }

  prevCard() {
    this.activeRoomIndex.update(idx => (idx - 1 + this.featuredRooms.length) % this.featuredRooms.length);
  }

  setCard(index: number) {
    this.activeRoomIndex.set(index);
  }

  getCardClass(index: number): string {
    const total = this.featuredRooms.length;
    const active = this.activeRoomIndex();

    if (index === active) return 'card-active';
    if (index === (active - 1 + total) % total) return 'card-prev';
    if (index === (active + 1) % total) return 'card-next';
    return 'card-hidden';
  }

  // Form Submission
  handleReserve(event: Event) {
    event.preventDefault();
    if (this.bookingData.guestName && this.bookingData.email) {
      this.isSubmitted.set(true);
    }
  }

  closeModal() {
    this.isSubmitted.set(false);
    this.bookingData = { guestName: '', email: '', checkIn: '', checkOut: '', guests: 2 };
  }
}