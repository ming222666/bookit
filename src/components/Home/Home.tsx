import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';

import { RoomItem } from './room';
import { Props } from '../../pages';

export function Home({ rooms, resPerPage, roomsCount, filteredRoomsCount, error }: Props): JSX.Element {
  useEffect((): void => {
    if (error) {
      toast.error(error.errormsg);
    }
  }, [error]);

  const router = useRouter();
  // eslint-disable-next-line prefer-const
  let { page = 1, location } = router.query;
  page = Number(page);

  let queryParams: URLSearchParams | null = null;
  if (typeof window !== 'undefined') {
    queryParams = new URLSearchParams(window.location.search);
  }

  const handlePagination = (pageNumber: number): void => {
    if (queryParams) {
      if (queryParams.has('page')) {
        queryParams.set('page', pageNumber + '');
      } else {
        queryParams.append('page', pageNumber + '');
      }
    }

    router.replace({ search: queryParams?.toString() });
  };

  let count = roomsCount;
  if (location) {
    count = filteredRoomsCount;
  }

  return (
    <>
      <section id="rooms" className="container mt-5">
        <h2 className="mb-3 ml-2 stays-heading">{location ? `Rooms in ${location}` : 'All Rooms'}</h2>

        <Link href="/search">
          <a className="ml-2 back-to-search">
            <i className="fa fa-arrow-left"></i> Back to Search{' '}
          </a>
        </Link>
        <div className="row">
          {rooms.length === 0 ? (
            <div className="alert alert-danger mt-5 w-100">
              <b>No Rooms.</b>
            </div>
          ) : (
            rooms.map((room) => <RoomItem key={room._id} room={room} />)
          )}
        </div>
      </section>

      {resPerPage < count && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={page}
            itemsCountPerPage={resPerPage}
            totalItemsCount={count}
            onChange={handlePagination}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="First"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
}
