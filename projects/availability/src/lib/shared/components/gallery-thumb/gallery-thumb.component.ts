import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
declare var $: any;

@Component({
  selector: 'fc-availability-gallery-thumb',
  templateUrl: './gallery-thumb.component.html',
  styleUrls: ['./gallery-thumb.component.scss']
})
export class GalleryThumbComponent implements OnInit {

  @Input() hotelImages: any = [];
  @Input() title = '';
  @Input() roomSelected: any;
  @Input() visibilityModal: boolean;
  @Input() galleryId = '';
  @Output() visibilityEvent = new EventEmitter();
  slideIndex = 1;
  clientXIni = 0;
  galleryLeftIni = 0;
  positionGalleryLeft = 0;
  galleryWidth = 20000;
  isMousedown = false;
  elementModalShadow: any;

  constructor() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLTextAreaElement;
      if (target.id === 'modal-shadow') {
        this.fecharModal();
      }
    });
  }

  fecharModal() {
    this.isMousedown = false;
    this.positionGalleryLeft = 0;
    this.clientXIni = 0;
    this.slideIndex = 1;
    this.visibilityModal = false;
    this.visibilityEvent.emit({ novoValor: false });
  }

  ngOnInit() {
    this.isMousedown = false;
  }

  plusDivs(n) {

    if (this.slideIndex === 1 && n === -1) { return; }
    if (this.slideIndex === this.hotelImages.length && n === 1) { return; }

    this.slideIndex += n;
    const count = n === -1 ? 120 : 0;
    this.positionGalleryLeft = Number(count - $('#gallery' + this.galleryId + ' .active').position().left);
  }

  clickThumb(index) {
    this.slideIndex = index + 1;
    this.goMoveGalleryOnClick();
  }

  @HostListener('touchmove', ['$event'])
  onTouchmove(event: TouchEvent) {
    const target = event.target as HTMLTextAreaElement;
    if (target.id.includes('gallery') || target.id.includes('mySlides')) {
      this.goMoveGallery(event.changedTouches[0].clientX);
    }

    if (target.id.includes('selectedSlide')) {
      if (event.changedTouches[0].clientX > this.clientXIni) {
        this.plusDivs(1);
      }
      if (event.changedTouches[0].clientX < this.clientXIni) {
        this.plusDivs(-1);
      }
    }

  }

  @HostListener('touchstart', ['$event'])
  onTouchstart(event: TouchEvent) {
    if (this.hotelImages) {
      const target = event.target as HTMLTextAreaElement;
      this.goStartMoveGallery(event.changedTouches[0].clientX);
    }
  }
  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    if (this.hotelImages) {
      const target = event.target as HTMLTextAreaElement;
      console.log(target.id);
      this.goStartMoveGallery(event.clientX);
    }
  }

  goMoveGallery(clientX) {
    const multiplierDistanceToMove = 3;
    this.positionGalleryLeft = this.galleryLeftIni + multiplierDistanceToMove * (clientX - this.clientXIni);
    if (this.positionGalleryLeft > 0) {
      this.positionGalleryLeft = 0;
    }

    this.galleryWidth = this.hotelImages.length * 110;

    if ((this.galleryWidth + this.positionGalleryLeft) < 300) {
      this.positionGalleryLeft = -1 * (this.galleryWidth - 250);
    }
  }

  goMoveGalleryOnClick() {
    const modalContent = document.getElementById('modal-content');
    const modalShadowLeft = (document.body.clientWidth - modalContent.clientWidth) / 2;

    let newLeftPositionSlide = 200;
    let newRightPositionSlide = document.body.clientWidth - 200;

    if (window.matchMedia('(max-width: 768px)').matches) {
      newLeftPositionSlide = 100;
      newRightPositionSlide = document.body.clientWidth - 100;
    }

    if (this.clientXIni >= (modalShadowLeft + modalContent.clientWidth - 110)) {
      this.positionGalleryLeft = (this.galleryLeftIni - (this.clientXIni - newLeftPositionSlide)) > 0 ?
        0 : this.galleryLeftIni - (this.clientXIni - newLeftPositionSlide);
    }

    if (this.clientXIni < (modalShadowLeft + 110)) {
      this.positionGalleryLeft = (this.galleryLeftIni - (this.clientXIni - newRightPositionSlide)) > 0 ?
        0 : this.galleryLeftIni - (this.clientXIni - newRightPositionSlide);
    }

    if (this.positionGalleryLeft > 0) {
      this.positionGalleryLeft = 0;
    }

    this.galleryWidth = this.hotelImages.length * 110;

    if ((this.galleryWidth + this.positionGalleryLeft) < 300) {
      this.positionGalleryLeft = -1 * (this.galleryWidth - 250);
    }
  }

  goStartMoveGallery(clientX) {
    this.isMousedown = true;
    this.clientXIni = clientX;
    const gallery = document.getElementById('gallery' + this.galleryId);
    // tslint:disable-next-line: radix
    this.galleryLeftIni = Number(gallery.style.left.replace('px', ''));
  }

}
