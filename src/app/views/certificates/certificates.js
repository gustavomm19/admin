import React, { useState } from 'react';
import { Breadcrumb, MatxLoading } from 'matx';
import {
  Icon, IconButton, Button, Tooltip,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import bc from 'app/services/breathecode';
import { SmartMUIDataTable } from 'app/components/SmartDataTable';
import CustomToolbarSelectCertificates from './certificates-utils/CertificateCustomToolbar';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const statusColors = {
  ERROR: 'text-white bg-error',
  PERSISTED: 'text-white bg-green',
  PENDING: 'text-white bg-secondary',
};

const Certificates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const columns = [
    {
      name: 'specialty',
      label: 'Specialty',
      options: {
        filter: true,
        customBodyRenderLite: (i) => items[i].specialty?.name,
      },
    },
    {
      name: 'user',
      label: 'User',
      options: {
        filter: true,
        customBodyRenderLite: (i) => (
          <Link
            to={`/admissions/students/${
              items[i].user !== null ? items[i].user.id : ''
            }`}
          >
            {items[i]
                && `${items[i].user.first_name} ${items[i].user.last_name}`}
          </Link>
        ),
      },
    },
    {
      name: 'status', // field name in the row object
      label: 'Status', // column title that will be shown in table

      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRender: (value, tableMeta, updateValue) => {
          const item = items[tableMeta.rowIndex];
          return (
            <div className="flex items-center">
              <div className="ml-3">
                {item.status_text !== null ? (
                  <Tooltip title={item.status_text}>
                    <small
                      className={
                        `border-radius-4 px-2 pt-2px${statusColors[value]}`
                      }
                    >
                      {value.toUpperCase()}
                    </small>
                  </Tooltip>
                ) : (
                  <small
                    className={
                      `border-radius-4 px-2 pt-2px${statusColors[value]}`
                    }
                  >
                    {value.toUpperCase()}
                  </small>
                )}
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'expires_at',
      label: 'Expires at',
      options: {
        filter: true,
        display: false,
        customBodyRenderLite: (i) => {
          const item = items[i];

          return (
            <div className="flex items-center">
              <div className="ml-3">
                <h5 className="my-0 text-15">
                  {item.expires_at !== null
                    ? dayjs(item.expires_at).format('MM-DD-YYYY')
                    : '-'}
                </h5>
                <small className="text-muted">
                  {item.expires_at !== null
                    ? dayjs(item.expires_at).format('MM-DD-YYYY')
                    : '-'}
                </small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: 'cohort', // field name in the row object
      label: 'Cohort', // column title that will be shown in table
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRender: (value, tableMeta, updateValue) => {
          const item = items[tableMeta.rowIndex];
          return (
            <Link to={`/admissions/cohorts/${item.cohort.slug}`}>
              {value.name}
            </Link>
          );
        },
      },
    },
    {
      name: 'preview_url',
      label: 'Preview',
      options: {
        filter: true,
        customBodyRenderLite: (i) => {
          if (items[i].status == 'PERSISTED') {
            return (
              <div className="flex items-center">
                <div className="flex-grow" />
                {items[i].preview_url !== null
                && items[i].preview_url !== undefined ? (
                  <>
                    <a
                      href={items[i].preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Tooltip
                        title={
                          items[i].preview_url !== null
                            ? 'Preview Available'
                            : 'Preview Not available'
                        }
                      >
                        <IconButton>
                          <Icon>image</Icon>
                        </IconButton>
                      </Tooltip>
                    </a>

                    <a
                      href={`https://certificate.breatheco.de/${items[
                        i
                      ].preview_url.slice(56)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Tooltip title="Image">
                        <IconButton>
                          <Icon>search</Icon>
                        </IconButton>
                      </Tooltip>
                    </a>
                  </>
                  ) : null}
              </div>
            );
          }
          return (
            <span className="flex items-center">{items[i].status_text}</span>
          );
        },
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[{ name: 'Certificates', path: '/certificates' }]}
            />
          </div>

          <div className="">
            <Link
              to="/certificates/new/single"
              color="primary"
              className="btn btn-primary"
            >
              <Button
                style={{ marginRight: 5 }}
                variant="contained"
                color="primary"
              >
                Add studend certificate
              </Button>
            </Link>
            <Link
              to="/certificates/new/all"
              color="primary"
              className="btn btn-primary"
            >
              <Button variant="contained" color="primary">
                Add cohort Certificates
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          {isLoading && <MatxLoading />}
          <SmartMUIDataTable
            title="All Certificates"
            columns={columns}
            items={items}
            options={{
              customToolbarSelect: (
                selectedRows,
                displayData,
                setSelectedRows,
                loadData,
              ) => (
                <CustomToolbarSelectCertificates
                  selectedRows={selectedRows}
                  displayData={displayData}
                  setSelectedRows={setSelectedRows}
                  items={items}
                  loadData={loadData}
                />
              ),
            }}
            search={async (querys) => {
              const { data } = await bc
                .certificates()
                .getAllCertificates(querys);
              setItems(data.results);
              return data;
            }}
            deleting={async (querys) => {
              const { status } = await bc
                .admissions()
                .deleteCertificatesBulk(querys);
              return status;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Certificates;