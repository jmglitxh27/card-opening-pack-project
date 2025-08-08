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
  collectedCards: any[] = [];
  trophySlots = new Array(50);

  selectedPack: any = null;
  isOpening = false;
  isExploded = false;
  currentRevealIndex = 0;
  pulledCards: any[] = [];
  coins: number = 0;
  
  

  currentQuote = '';
  quotes = [
    "Step right up!",
    "Which pack will it be, champion?",
    "Today's your lucky day!",
    "Big rewards await!",
    "Do you feel the sparkle?"
  ];

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.coins = 10000;
    localStorage.setItem('coins', this.coins.toString());
    this.updateCoinDisplay();

    this.loadPacks();
    this.startQuoteRotation();
  }

  async loadPacks() {
    const { data, error } = await this.supabase.getAllPacks();
    if (error) {
      console.error('Error fetching packs:', error);
    } else {
      this.packs = data;
    }
  }

  startQuoteRotation() {
    this.currentQuote = this.quotes[0];
    let index = 1;

    setInterval(() => {
      this.currentQuote = this.quotes[index];
      index = (index + 1) % this.quotes.length;
    }, 4000);
  }

  handlePackClick(pack: any, event: Event): void {
    event.stopPropagation();

    const packCost = pack.price || 500; // Default cost if not provided

    if (this.coins < packCost) {
      alert("Not enough coins to open this pack!");
      return;
    }

    this.coins -= packCost;
    this.updateCoinDisplay();

    this.selectedPack = pack;
    this.isOpening = true;

    setTimeout(() => {
      this.isExploded = true;
      this.openPack(pack);
    }, 2000); // Explosion delay
  }

  getRarityFromRoll(probabilities: any): string {
    const roll = Math.random();
    let cumulative = 0;
    for (const rarity of ['common', 'rare', 'legendary']) {
      cumulative += probabilities[rarity] || 0;
      if (roll < cumulative) return rarity;
    }
    return 'common';
  }
  updateCoinDisplay() {
    localStorage.setItem('coins', this.coins.toString());
  }

  addCoins(amount: number) {
    this.coins += amount;
    this.updateCoinDisplay();
  }
  async openPack(pack: any): Promise<void> {
    const { data: players, error } = await this.supabase.getAllPlayers();
    if (error || !players) {
      console.error('Error fetching players:', error);
      return;
    }
    
    const cardsPerPack = pack.cards_per_pack || 3;
    const pullRates = pack.rarity_pull_rates || {
      common: 0.85,
      rare: 0.14,
      legendary: 0.01
    };

    const rarityBuckets = {
      common: players.filter(p => p.rating < 83),
      rare: players.filter(p => p.rating >= 83 && p.rating < 90),
      legendary: players.filter(p => p.rating >= 90)
    };

    this.pulledCards = [];

    for (let i = 0; i < cardsPerPack; i++) {
      const rarity = this.getRarityFromRoll(pullRates);
      const bucket = rarityBuckets[rarity as 'common' | 'rare' | 'legendary'];
      if (bucket.length === 0) continue;
      const card = bucket[Math.floor(Math.random() * bucket.length)];
      this.pulledCards.push({
        id: card.id,
        name: card.player_name,
        image: card.card_image_url,
        position: card.position,
        rating: card.rating,
        nationality: card.nationality,
        rarity,
        teamLogo: card.team?.logo_url || null
      });
    }

    this.currentRevealIndex = 0;
  }

  revealNextCard(): void {
    this.currentRevealIndex++;
    if (this.currentRevealIndex >= this.pulledCards.length) {
      this.finishCardReveal();
    }
  }

  finishCardReveal(): void {
    let newCardsAdded = 0;
    let duplicateCount = 0;

    const newCards = this.pulledCards.map(card => ({
      ...card,
      justUnlocked: true,
      id: card.id // Make sure `id` is passed from `openPack`
    }));

    const uniqueCollected = new Map(this.collectedCards.map(c => [c.id, c]));

    for (const card of newCards) {
      if (uniqueCollected.has(card.id)) {
        // Duplicate found — give coin(s)
        this.addCoins(5); // You can change the amount per duplicate
        duplicateCount++;
      } else {
        uniqueCollected.set(card.id, card);
        newCardsAdded++;
      }
    }

    // Update collectedCards with no duplicates
    this.collectedCards = Array.from(uniqueCollected.values());

    // Remove `justUnlocked` flag after animation
    setTimeout(() => {
      this.collectedCards.forEach(card => (card.justUnlocked = false));
    }, 1000);

    this.isOpening = false;
    this.isExploded = false;
    this.pulledCards = [];
    this.selectedPack = null;

    console.log(`Added ${newCardsAdded} new cards. Found ${duplicateCount} duplicates.`);
  }

}
