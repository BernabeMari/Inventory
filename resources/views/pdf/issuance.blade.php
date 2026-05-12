<h2>REQUEST ISSUANCE</h2>

<p>Department: {{ Auth::user()->department }}</p>
<p>Date: {{ now()->format('F d, Y') }}</p>

<table width="100%" border="1">
    <tr>
        <th>Request ID</th>
        <th>Request Item</th>
        <th>Request Quantity</th>
        <th>Issued Item</th>
        <th>Fulfilled Quantity</th>
        <th>Unfulfilled Quantity</th>
        <th>Status</th>
    </tr>

    @php
        $items = is_array($request->item) ? $request->item : [$request->item];
        $issuances = $issuances instanceof \Illuminate\Support\Collection ? $issuances : collect($issuances);
    @endphp

    @foreach($items as $index => $item)
    @php $issuance = $issuances->get($index); @endphp
    <tr style="text-align: center;">
        @if($loop->first)
            <td rowspan="{{ count($items) }}" class="text-center">{{ $request->id }}</td>
        @endif
        
        <td>{{ $item }}</td>
        <td>{{ is_array($request->quantity) ? ($request->quantity[$index] ?? '') : $request->quantity }}</td>
        <td>{{ optional($issuance)->issued_item ?? '' }}</td>
        <td>{{ optional($issuance)->fulfilled_quantity ?? '' }}</td>
        <td>{{ optional($issuance)->unfulfilled_quantity ?? '' }}</td>
        @if($loop->first)
            <td rowspan="{{ count($items) }}" class="text-center">{{ $request->status }}</td>
        @endif
    </tr>
    @endforeach
    
</table>
<br><br>

<div style="margin-top: 80px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 200px;">
        <div style="border-top: 1px solid #000;"></div>
        <p>Requester Signature</p>
    </div>

    <div style="text-align: center; width: 200px; margin-top: 80px;">
        <div style="border-top: 1px solid #000;"></div>
        <p>Approved By</p>
    </div>
</div>