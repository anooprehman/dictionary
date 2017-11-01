import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CsvReaderProvider } from '../../providers/csv-reader/csv-reader';

export interface Vocab {
  english?: string;
  type?:string;
  malayalam?: string;
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  allVocabs:Vocab[] = [];
  Vocabs:Vocab[] = [];
  filteredVocabs:Vocab[] = [];
  searchQuery: string = '';
  allVocabLoaded: boolean = false;

  constructor(public navCtrl: NavController, public csvReader: CsvReaderProvider, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocabListPage');
    let loading = this.loadingCtrl.create({content:'Loading...'});
    loading.present();
    this.csvReader.loadCSV().then((data:any) => {
      console.log(data)
      this.allVocabs = data.map(item => ({
        english: item['english'],
        type:item['type'],
        malayalam: item['malayalam']
      })
    );
      this.Vocabs = this.allVocabs.slice(0);
      this.filteredVocabs = this.Vocabs.slice(0);
      this.filteredVocabs.splice(20);
      loading.dismiss();
    })
  }

  getVocabs(ev) {
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.Vocabs = this.allVocabs.filter((item) => {
        return (item.english.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.malayalam.indexOf(val) > -1);
      })
    }
    else{
      this.Vocabs = this.allVocabs.slice(0);
    }
    this.filteredVocabs = this.Vocabs.slice(0);
    if(!this.allVocabLoaded)
      this.filteredVocabs.splice(20);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let currentLength = this.filteredVocabs.length;
    let totalLength = this.Vocabs.length;

    if(currentLength == this.allVocabs.length){
      infiniteScroll.enable(false);
      infiniteScroll.complete();
      this.allVocabLoaded = true;
    }

    setTimeout(() => {
      for (let j = 0; j < 20; j++) {
        if(currentLength+j < totalLength)
          this.filteredVocabs.push( this.Vocabs[currentLength+j] );
      }
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);

  }

}
