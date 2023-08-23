import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private infoMatches = new Subject<any>(); //need to create a subject
    private featuredNewsList = new Subject<any>();
    private streamsList = new Subject<any>();
    private new = new Subject<any>();

    sendInfoMatchesUpdate(message: any) { //the component that wants to update something, calls this fn
        this.infoMatches.next({ message }); //next() will feed the value in Subject
    }

    getInfoMatchesUpdate(): Observable<any> { //the receiver component calls this function 
        return this.infoMatches.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }

    sendfeaturedNewsListClubUpdate(message: any) { //the component that wants to update something, calls this fn
        this.featuredNewsList.next({ message }); //next() will feed the value in Subject
    }

    getfeaturedNewsListClubUpdate(): Observable<any> { //the receiver component calls this function 
        return this.featuredNewsList.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }

    sendStreamsDataUpdate(message: any) { //the component that wants to update something, calls this fn
        this.streamsList.next({ message }); //next() will feed the value in Subject
    }

    getStreamsDataUpdate(): Observable<any> { //the receiver component calls this function 
        return this.streamsList.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }
    sendNewDataUpdate(message: any) { //the component that wants to update something, calls this fn
        this.new.next({ message }); //next() will feed the value in Subject
    }

    getNewDataUpdate(): Observable<any> { //the receiver component calls this function 
        return this.new.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }
}