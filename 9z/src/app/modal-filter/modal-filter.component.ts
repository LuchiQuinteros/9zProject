import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss']
})
export class ModalFilterComponent implements OnInit {
  title!: string;
  body!: string;
  selectedTeamsOptions: { label: string, value: number, checked: boolean}[] = [];
  selectedDisciplinesOptions: { label: string, value: number, checked: boolean}[] = [];
  teamsOptions: string[] = [];
  disciplinesOptions: string[] = [];
  selectTeams: string[] = [];
  selectDisciplines: string[] = [];
  selectedOptions = {
    'teams': [],
    'disciplines': [],
  };

  constructor(
    public dialogRef: MatDialogRef<ModalFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
      this.title = this.data.title;
      this.body = this.data.body;
    
      if(this.data.options != undefined) {
        this.selectedOptions = this.data.options;
        this.selectedTeamsOptions = this.selectedOptions.teams;
        this.selectedDisciplinesOptions = this.selectedOptions.disciplines;
    
       
        const filteredTeamsOptions = this.selectedTeamsOptions.filter(option => option.checked);
        const filteredDisciplinesOptions = this.selectedDisciplinesOptions.filter(option => option.checked);
        this.selectTeams = filteredTeamsOptions.map(option => option.label);
        this.selectDisciplines = filteredDisciplinesOptions.map(option => option.label);

        this.teamsOptions = this.data.options.teams.map((option: {label: string, value: number, checked: boolean}) => option.label);
        this.disciplinesOptions = this.data.options.disciplines.map((option: {label: string, value: number, checked: boolean}) => option.label);
      }
    }

    onSelect(data: any) {
      const selectedTeamsOption = this.selectedTeamsOptions.find(option => option.label == data.value);
      const selectedDisciplinesOption = this.selectedDisciplinesOptions.find(option => option.label == data.value);

      if (selectedTeamsOption) {
        selectedTeamsOption.checked = !selectedTeamsOption.checked;
      }

      if (selectedDisciplinesOption) {
        selectedDisciplinesOption.checked = !selectedDisciplinesOption.checked;
      }
    }


  confirmar() {
    // Crea una copia de selectedOptions en lugar de asignar directamente
    const optionsCopy = { ...this.selectedOptions };
    this.dialogRef.close(optionsCopy);
  }

  cancelar() {
    this.dialogRef.close(null); // Cerrar el diálogo sin cambios
  }

}
