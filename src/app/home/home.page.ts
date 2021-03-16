import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddGroupPage } from '../add-group/add-group.page';
import { Group } from '../models/group';
import { GroupMember } from '../models/group-member';
import { Item } from '../models/item';
import { Person } from '../models/person';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  idCount = 0;

  fullPaidAmount = 0;
  leftoverFullAmount = 0;
  strippedAmount = 0;
  items: Item[] = [];
  persons: Person[] = [];
  groups: Group[] = [];

  personName: string;

  constructor(private modalController: ModalController) { }

  addPerson(name: string = this.personName) {
    console.log(name);

    if (name === null || name === '') {
      return;
    }

    const person: Person = {
      personId: this.idCount.toString(),
      name,
      paidAmount: 0,
      selfAmount: 0,
      groupAmount: 0,
      balance: 0
    };

    this.persons.unshift(person);

    this.personName = '';
    this.idCount++;

    this.calcBalance();
  }

  addPersonByEnter(event) {
    if (event.key === 'Enter') {
      this.addPerson();
    }

    this.calcBalance();
  }

  addItem(name: string, price: number) {
    const item: Item = {
      name,
      price
    };

    this.items.push(item);
  }

  async openAddGroupModal() {
    const modal = await this.modalController.create({
      component: AddGroupPage,
      componentProps: {
        persons: this.persons
      }
    });

    modal.onDidDismiss().then(data => {
      console.log('data returned', data);

      if (!data.data?.personIds) {
        return;
      }

      const group: Group = {
        groupMembers: [],
        groupAmount: 0
      };

      data.data.personIds.forEach(pId => {
        const person = this.persons.find(p => p.personId === pId);
        console.log(person);

        const groupMember: GroupMember = {
          name: person.name,
          personId: person.personId
        };

        group.groupMembers.push(groupMember);
      });

      console.log('group to be added', group);
      this.groups.push(group);

      console.log('groups', this.groups);
    });

    modal.present();
  }

  calcStrippedAmount() {
    this.strippedAmount = this.fullPaidAmount;
    this.persons.forEach(element => {
      this.strippedAmount -= element.selfAmount;
      this.strippedAmount -= element.groupAmount;
    });

    this.calcBalance();
  }

  calcLeftoverFullAmount() {
    this.leftoverFullAmount = this.fullPaidAmount;
    this.persons.forEach(element => {
      this.leftoverFullAmount -= element.paidAmount;
    });

    this.calcBalance();
  }

  calcBalance() {
    this.persons.forEach(person => {
      person.balance = ((this.strippedAmount / this.persons.length - person.paidAmount) + person.selfAmount + person.groupAmount);
    });
  }

  distributeGroupAmount() {
    this.resetGroupAmount();

    this.groups.forEach(group => {

      group.groupMembers.forEach(member => {
        this.persons.find(p => p.personId === member.personId).groupAmount += group.groupAmount / group.groupMembers.length;
      });

    });

    this.calcBalance();
  }

  resetGroupAmount() {
    this.groups.forEach(group => {
      group.groupMembers.forEach(member => {
        this.persons.find(p => p.personId === member.personId).groupAmount = 0;
      });
    });
  }

  resetFullPaidAmount() {
    this.fullPaidAmount = 0;
    this.calcStrippedAmount();
  }

  resetPersons() {
    this.persons = [];
  }

  resetIdCount() {
    this.idCount = 0;
  }

  resetGroups() {
    this.groups = [];
  }

  resetEverything() {
    this.resetFullPaidAmount();
    this.resetPersons();
    this.resetIdCount();
    this.resetGroups();
  }
}
