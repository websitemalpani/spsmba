import {PageHero} from '@/components/page-hero';import {getGalleryAlbums} from '@/lib/api';import {GalleryLightbox} from '@/components/gallery-lightbox';
export default async function Gallery(){const galleryAlbums=await getGalleryAlbums();return <main>
<PageHero kicker="Gallery" title="Campus life, in pictures." body="Induction programmes, industrial visits, guest lectures and campus activities from around SPS MBA. Click an album to view every photo."/>
<section className="mx-auto max-w-7xl px-5 py-20"><GalleryLightbox albums={galleryAlbums}/></section>
</main>}
