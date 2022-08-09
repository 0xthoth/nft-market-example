import React from 'react';

import MarketItems from 'components/Market'
import { useApp } from 'hooks/useApp';

const Market = () => {
  const { data: appDetails } = useApp();

  return (
    <div>
      <h1>Markets</h1>

      <MarketItems temApproved={Number(appDetails?.temApprovedMarket) > 0} />
    </div>
  )
}

export default Market;