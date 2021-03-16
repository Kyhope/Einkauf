import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Person } from '../models/person';
import { PersonIdCheck } from '../models/person-id-check';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage implements OnInit {

  @Input()
  persons: Person[];

  personIdChecks: PersonIdCheck[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.persons.forEach(element => {
      const personIdCheck: PersonIdCheck = {
        name: element.name,
        isChecked: false,
        personId: element.personId
      };

      this.personIdChecks.push(personIdCheck);
    });
  }

  confirmPersonIdCheck() {
    const personIds: string[] = [];

    this.personIdChecks.forEach(element => {
      console.log("element", element);
      if (element.isChecked) {
        personIds.push(element.personId);
      }
    });

    console.log("personids", personIds);

    this.modalController.dismiss({
      personIds
    });
  }

}
