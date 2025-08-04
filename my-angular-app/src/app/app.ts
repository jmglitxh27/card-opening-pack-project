import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  packs: any[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getAllPacks();
    if (error) {
      console.error('Error fetching packs:', error);
    } else {
      this.packs = data;
    }
    this.startQuoteRotation();
  }

  openPack(pack: any): void {
    console.log('Opening pack:', pack);
    // Placeholder: Replace with actual logic to pull random cards
  }

  getRarityClass(packId: number): string {
    switch (packId) {
      case 1: return 'rarity-common';
      case 2: return 'rarity-rare';
      case 3: return 'rarity-legendary';
      default: return '';
    }
  }

  handlePackClick(pack: any, event: Event): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.add('clicked-pack');

    setTimeout(() => {
      target.classList.remove('clicked-pack');
      this.openPack(pack);
    }, 200);
  }

  currentQuote = '';
  quotes = [
    "Step right up!",
    "Which pack will it be, champion?",
    "Today's your lucky day!",
    "Big rewards await!",
    "Do you feel the sparkle?"
  ];

  startQuoteRotation() {
    this.currentQuote = this.quotes[0];
    let index = 1;

    setInterval(() => {
      this.currentQuote = this.quotes[index];
      index = (index + 1) % this.quotes.length;
    }, 4000);
  }

  // ✅ Add this:
  collectedCards = [
    {
      name: 'Fire Fang',
      image: 'assets/cards/firefang.png',
    },
    {
      name: 'Ice Shield',
      image: 'assets/cards/iceshield.png',
    },
    {
      name: 'Thunder Roar',
      image: 'assets/cards/thunderroar.png',
    },
  ];

  trophySlots = new Array(12); // 12 slots (3x4 grid or 4x3, customize as needed)
}
