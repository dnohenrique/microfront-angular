import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { List } from 'linqts';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'fc-availability-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.scss']
})
export class ReviewDetailComponent implements OnInit {

  imgDefault = 'https://http2.mlstatic.com/foto-desenho-para-o-seu-perfil-das-redes-sociais-D_NQ_NP_614041-MLB27185740295_042018-O.jpg';

  constructor(private detailService: DetailService) { }
  @Input() reviewHotel = {
    notaMediaExibicao: 0,
    notaDescricao: '',
    totalAvaliacoes: 0
  };
  @Input() hotelId = '';
  @Output() resultReviews: EventEmitter<any> = new EventEmitter<any>();

  @Input() viewRating: boolean;
  entityReview = { total: 0, reviews: [] };
  reviewsView: any = [{}];

  ngOnInit() {

    this.detailService.getReviewDetail(Number(this.hotelId)).then(result => {
      if (result) {
        new List<any>(result.reviews).ForEach(r => {
          r.isTextLong = r.descricaoExperiencia.length > 384;
          const names = new List<any>(r.nomeAutor.split(' '));
          r.nomeInicial = names.First().substring(0, 1).toUpperCase();
          r.text = r.descricaoExperiencia;
          if (r.isTextLong) {
            r.textMin = r.descricaoExperiencia.substring(0, 384);
          }
        });
        this.entityReview = result;
        this.resultReviews.emit(result.total);
      }
    }).catch(() => {
      this.entityReview = { total: 0, reviews: [] };
    });

  }

  getRatings(datas) {
    const limit = 471;
    new List<any>(datas).ForEach(review => {
      review.isTextLong = false;
      if (review.text.length > limit) {
        review.isTextLong = true;
        review.textMin = review.text.substring(0, limit);
      }
    });

    this.reviewsView = datas;
  }

  accordionRating() {
    this.viewRating = !this.viewRating;
  }

  viewPlus(review) {
    review.isTextLong = !review.isTextLong;
  }
}
