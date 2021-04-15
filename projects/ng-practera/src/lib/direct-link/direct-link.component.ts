import { Component, Input } from '@angular/core';

@Component({
  selector: 'prac-direct-link',
  templateUrl: './direct-link.component.html',
  styleUrls: ['./direct-link.component.scss']
})
export class DirectLinkComponent{

  @Input() waitingMessage = 'We are redirecting you to the page you want to go to, please be patient';

  constructor() { }


}
