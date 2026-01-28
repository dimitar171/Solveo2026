import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  useRegionsList,
  useCountriesList,
  useRegionalBreakdown,
  useCountryBreakdown,
  useCityBreakdown,
} from '../hooks/useRegions';
import type { RegionalBreakdown, CountryBreakdown, CityBreakdown } from '../types';

function formatNumber(n: number) {
  return n.toLocaleString();
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

type ViewLevel = 'region' | 'country' | 'city';

function GeoBreakdown() {
  const [selectedRegion, setSelectedRegion] = useState<string | ''>('');
  const [selectedCountry, setSelectedCountry] = useState<string | ''>('');

  const level: ViewLevel =
    selectedCountry ? 'city' : selectedRegion ? 'country' : 'region';

  const { data: regionsList = [] } = useRegionsList();
  const { data: countriesList = [] } = useCountriesList(
    selectedRegion || undefined
  );

  const { data: regionData = [], isLoading: loadingRegions } =
    useRegionalBreakdown();
  const { data: countryData = [], isLoading: loadingCountries } =
    useCountryBreakdown(selectedRegion || undefined);
  const { data: cityData = [], isLoading: loadingCities } =
    useCityBreakdown(selectedCountry || undefined);

  const isLoading =
    (level === 'region' && loadingRegions) ||
    (level === 'country' && loadingCountries) ||
    (level === 'city' && loadingCities);

  let tableTitle = 'Regions';
  let tableData: (RegionalBreakdown | CountryBreakdown | CityBreakdown)[] =
    regionData;

  if (level === 'country') {
    tableTitle = `Countries in ${selectedRegion}`;
    tableData = countryData;
  } else if (level === 'city') {
    tableTitle = `Cities in ${selectedCountry}`;
    tableData = cityData;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Breakdown</CardTitle>
        <CardDescription>
          Drill down from region to country and city performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCountry('');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All regions</option>
              {regionsList.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={!selectedRegion}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">All countries</option>
              {countriesList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading geographic data...</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No geographic data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left border border-gray-200 bg-white rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 font-semibold text-gray-900 border-b border-r border-gray-200">
                    {level === 'region'
                      ? 'Region'
                      : level === 'country'
                      ? 'Country'
                      : 'City'}
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 border-b border-r border-gray-200">
                    Traffic
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 border-b border-r border-gray-200">
                    Paid conversions
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 border-b border-r border-gray-200">
                    MRR
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 border-b border-gray-200">
                    Conversion / CAC
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any) => (
                  <tr key={row.region || row.country || row.city} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900 border-t border-r border-gray-200">
                      {row.region || row.country || row.city}
                    </td>
                    <td className="px-3 py-2 text-gray-900 border-t border-r border-gray-200">
                      {formatNumber(
                        (row.totalTraffic ??
                          (row as RegionalBreakdown).totalTraffic ??
                          0) as number
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-900 border-t border-r border-gray-200">
                      {formatNumber(
                        (row.paidConversions ??
                          (row as RegionalBreakdown).paidConversions ??
                          0) as number
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-900 border-t border-r border-gray-200">
                      {formatCurrency((row.mrr ?? 0) as number)}
                    </td>
                    <td className="px-3 py-2 text-gray-900 border-t border-gray-200">
                      {row.avgConversion != null
                        ? `${row.avgConversion.toFixed(1)}%`
                        : level === 'region'
                        ? `${(row.avgTrialToPaidRate ?? 0).toFixed(1)}%`
                        : '—'}
                      {level === 'city' && row.avgCAC != null && (
                        <span className="ml-2 text-xs text-gray-500">
                          · CAC {formatCurrency(row.avgCAC as number)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GeoBreakdown;

