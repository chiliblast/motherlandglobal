import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  constructor(public MS: MessageService) {}

  signout_clickHandler() {
    this.MS.user = null;
    this.MS.videos = null;
  }
}
