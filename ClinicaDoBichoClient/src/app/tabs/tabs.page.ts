import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { addCircleOutline, calendarOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonTabBar,
    IonTabs,
    IonLabel,
    IonTabButton,
    IonIcon,
  ]
})
export class TabsPage implements OnInit {

  constructor() {
    addIcons({ homeOutline, calendarOutline, addCircleOutline})
  }

  ngOnInit() {
  }



}
